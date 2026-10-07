const { UserService } = require('../src/userService');

describe('UserService', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  describe('createUser', () => {
    test('deve retornar um usuário com id gerado e status ativo', () => {
      // Arrange
      const nome = 'Fulano de Tal';
      const email = 'fulano@teste.com';
      const idade = 25;

      // Act
      const usuario = userService.createUser(nome, email, idade);

      // Assert
      expect(usuario).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          nome,
          email,
          idade,
          isAdmin: false,
          status: 'ativo',
        })
      );
    });

    test('deve lançar erro ao criar usuário menor de idade', () => {
      // Arrange
      const criarMenorDeIdade = () =>
        userService.createUser('Menor', 'menor@email.com', 17);

      // Act & Assert
      expect(criarMenorDeIdade).toThrow('O usuário deve ser maior de idade.');
    });

    test('deve lançar erro quando campos obrigatórios estão ausentes', () => {
      // Arrange
      const criarSemEmail = () => userService.createUser('Sem Email', '', 30);

      // Act & Assert
      expect(criarSemEmail).toThrow('Nome, email e idade são obrigatórios.');
    });
  });

  describe('getUserById', () => {
    test('deve retornar o usuário previamente criado', () => {
      // Arrange
      const usuarioCriado = userService.createUser('Ana', 'ana@teste.com', 30);

      // Act
      const usuarioBuscado = userService.getUserById(usuarioCriado.id);

      // Assert
      expect(usuarioBuscado).toEqual(usuarioCriado);
    });

    test('deve retornar null para um id inexistente', () => {
      // Act
      const usuario = userService.getUserById('id-inexistente');

      // Assert
      expect(usuario).toBeNull();
    });
  });

  describe('deactivateUser', () => {
    test('deve desativar um usuário comum', () => {
      // Arrange
      const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

      // Act
      const resultado = userService.deactivateUser(usuarioComum.id);

      // Assert
      expect(resultado).toBe(true);
      expect(userService.getUserById(usuarioComum.id).status).toBe('inativo');
    });

    test('não deve desativar um usuário administrador', () => {
      // Arrange
      const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

      // Act
      const resultado = userService.deactivateUser(usuarioAdmin.id);

      // Assert
      expect(resultado).toBe(false);
      expect(userService.getUserById(usuarioAdmin.id).status).toBe('ativo');
    });

    test('deve retornar false para um usuário inexistente', () => {
      // Act
      const resultado = userService.deactivateUser('id-inexistente');

      // Assert
      expect(resultado).toBe(false);
    });
  });

  describe('generateUserReport', () => {
    test('deve incluir nome e status de cada usuário cadastrado', () => {
      // Arrange
      userService.createUser('Alice', 'alice@email.com', 28);
      userService.createUser('Bob', 'bob@email.com', 32);

      // Act
      const relatorio = userService.generateUserReport();

      // Assert
      expect(relatorio).toMatch(/Alice.*ativo/);
      expect(relatorio).toMatch(/Bob.*ativo/);
    });

    test('deve informar que não há usuários quando o cadastro está vazio', () => {
      // Act
      const relatorio = userService.generateUserReport();

      // Assert
      expect(relatorio).toContain('Nenhum usuário cadastrado.');
    });
  });
});
