import { describe, beforeEach, it, expect } from 'vitest';
import { RegisterAthleteUseCase } from './register-athlete';

import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryAthletesRepository } from 'test/repositores/in-memory-athletes-repository';

let inMemoryAthletesRepository: InMemoryAthletesRepository;
let fakeHasher: FakeHasher;
let sut: RegisterAthleteUseCase; // sut = System Under Test

describe('Register Athlete', () => {
  beforeEach(() => {
    // Instanciando os dublês de teste (Fakes)
    inMemoryAthletesRepository = new InMemoryAthletesRepository();
    fakeHasher = new FakeHasher();

    // Injetando as dependências no Caso de Uso
    sut = new RegisterAthleteUseCase(inMemoryAthletesRepository, fakeHasher);
  });

  it('should be able to register a new athlete', async () => {
    const { athlete } = await sut.execute({
      name: 'Francisco Neto',
      email: 'francisco@example.com',
      password: 'password123',
    });

    // Verificações (Assertions)
    expect(athlete.id).toBeTruthy();
    expect(inMemoryAthletesRepository.items[0].name).toEqual('Francisco Neto');

    // Verifica se a senha no "banco" foi hasheada pelo nosso FakeHasher
    expect(inMemoryAthletesRepository.items[0].password).toEqual(
      'password123-hashed',
    );
  });

  it('should not be able to register an athlete with same email', async () => {
    const email = 'same-email@example.com';

    // Primeiro cadastro
    await sut.execute({
      name: 'First Athlete',
      email,
      password: 'password123',
    });

    // O segundo cadastro com o mesmo e-mail deve falhar (lançar erro)
    await expect(() =>
      sut.execute({
        name: 'Second Athlete',
        email,
        password: 'password123',
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
