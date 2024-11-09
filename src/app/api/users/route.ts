
import { NextResponse } from "next/server";
import { Users } from "lib/entities/User";
import { initializeDataSource } from "lib/db";

export async function GET() {
  const dataSource = await initializeDataSource();
  const userRepository = dataSource.getRepository(Users);

  const users = await userRepository.find();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const dataSource = await initializeDataSource();
  const userRepository :any = dataSource.getRepository(Users);

  const { name, email } = await request.json();
  const newUser = userRepository.create({ name, email });
  await userRepository.save(newUser);

  return NextResponse.json(newUser);
}
