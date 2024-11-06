
import { NextResponse } from 'next/server';
import { User } from 'lib/entities/User';
import { initializeDataSource } from 'lib/db';

export async function GET() {
  const dataSource = await initializeDataSource();
  const userRepository = dataSource.getRepository(User);

  const users = await userRepository.find();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const dataSource = await initializeDataSource();
  const userRepository = dataSource.getRepository(User);

  const { name, email } = await request.json();
  const newUser = userRepository.create({ name, email });
  await userRepository.save(newUser);

  return NextResponse.json(newUser);
}
