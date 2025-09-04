import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'firebase-admin/auth';
import { Firestore, FieldValue } from 'firebase-admin/firestore';

@Injectable()
export class UsersService {
  constructor(
    @Inject('FIREBASE_AUTH') private readonly auth: Auth,
    @Inject('FIREBASE_FIRESTORE') private readonly firestore: Firestore,
  ) {}

  async registerUser(data: CreateUserDto) {
    const { name, email, password, DDD, phone_number } = data;
    const userRecord = await this.auth.createUser({
      email: email,
      password: password,
    });

    const timestamp = FieldValue.serverTimestamp();

    await this.firestore
      .collection('users')
      .doc(userRecord.uid)
      .set({
        uid: userRecord.uid,
        name,
        email,
        phone: `${DDD}${phone_number}`,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

    return {
      uid: userRecord.uid,
      name,
      email,
    };
  }
}
