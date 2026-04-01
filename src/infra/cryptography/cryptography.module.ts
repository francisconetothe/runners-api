import { Module } from '@nestjs/common';

// Importe os contratos (interfaces abstratas)
import { HashGenerator } from '@/domain/runners/application/cryptography/hash-generator';
import { HashComparer } from '@/domain/runners/application/cryptography/hash-comparer'; // <-- Adicione este import

// Importe a implementação real
import { BcryptHasher } from './bcrypt-hasher';

@Module({
  providers: [
    {
      // Provedor para GERAR hash (usado no registro)
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
    {
      // Provedor para COMPARAR hash (usado no login)
      provide: HashComparer,
      useClass: BcryptHasher,
    },
  ],
  // 🚀 IMPORTANTE: Exporte ambos para que o HttpModule consiga enxergá-los
  exports: [HashGenerator, HashComparer],
})
export class CryptographyModule {}
