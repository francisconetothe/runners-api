import { HashComparer } from '@/domain/runners/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/runners/application/cryptography/hash-generator';

export class FakeHasher implements HashGenerator, HashComparer {
  hash(plain: string): Promise<string> {
    // Retornamos uma Promise resolvida diretamente para evitar o erro de 'require-await'
    return Promise.resolve(plain.concat('-hashed'));
  }

  compare(plain: string, hash: string): Promise<boolean> {
    // Mesma lógica aqui
    return Promise.resolve(plain.concat('-hashed') === hash);
  }
}
