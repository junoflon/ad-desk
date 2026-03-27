import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return error("이메일과 비밀번호를 입력해주세요.");
    }

    if (password.length < 6) {
      return error("비밀번호는 6자 이상이어야 합니다.");
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return error("이미 가입된 이메일입니다.");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: name || null,
      },
    });

    return success({ id: user.id, email: user.email }, 201);
  } catch (e) {
    return error(`회원가입 실패: ${e instanceof Error ? e.message : e}`, 500);
  }
}
