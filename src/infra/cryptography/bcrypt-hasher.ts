import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcryptjs'; // <--- Importe o 'compare' aqui
import { HashGenerator } from '@/domain/runners/application/cryptography/hash-generator';
import { HashComparer } from '@/domain/runners/application/cryptography/hash-comparer'; // <--- Importe o contrato

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8;

  // Usado no Cadastro (Register)
  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }

  // Usado no Login (Authenticate) - ESSA PARTE FALTA NO SEU!
  async compare(plain: string, hash: string): Promise<boolean> {
    // O bcryptjs.compare pega a senha digitada e compara com o hash do banco
    return compare(plain, hash);
  }
}
