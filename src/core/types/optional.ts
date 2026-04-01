/**
 * Esse tipo utilitário permite tornar algumas propriedades de um tipo opcionais.
 * * Exemplo de uso:
 * Optional<AthleteProps, 'createdAt'>
 **/

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
