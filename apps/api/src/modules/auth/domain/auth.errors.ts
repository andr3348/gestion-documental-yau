export class InvalidCredentialsError extends Error {
  constructor() {
    super('Credenciales inválidas');
  }
}

export class EmailAlreadyExistsError extends Error {
  constructor() {
    super('El email ya está registrado');
  }
}

export class DniAlreadyExistsError extends Error {
  constructor() {
    super('El DNI ya está registrado');
  }
}
