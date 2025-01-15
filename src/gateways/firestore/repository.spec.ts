// repository.spec.ts

import { Firestore } from '@google-cloud/firestore';
import { jest } from '@jest/globals';

import { Repository } from './repository';

type MockFirestore = jest.Mocked<Firestore>;

jest.mock('@google-cloud/firestore', () => {
  const docMock = jest.fn();
  const collectionMock = jest.fn().mockReturnValue({
    doc: docMock,
  });
  const firestoreMock = {
    collection: collectionMock,
  };

  return {
    Firestore: jest.fn(() => firestoreMock),
  };
});

describe('Repository', () => {
  let mockFirestore: MockFirestore;
  let repository: Repository<{ name: string }>;

  beforeEach(() => {
    mockFirestore = new Firestore() as MockFirestore;
    repository = new Repository(mockFirestore, 'testCollection');
  });

  describe('verifyID', () => {
    it('should throw an error if ID is not provided', () => {
      expect(() => repository.verifyID('')).toThrow('id is required');
    });

    it('should throw an error if ID length is not 36 characters', () => {
      expect(() => repository.verifyID('short-id')).toThrow('id is invalid');
    });

    it('should throw an error if ID is not a string', () => {
      expect(() => repository.verifyID(123 as unknown as string)).toThrow(
        'id is invalid'
      );
    });

    it('should not throw an error for valid ID', () => {
      expect(() =>
        repository.verifyID('12345678-1234-1234-1234-123456789012')
      ).not.toThrow();
    });
  });

  describe('create', () => {
    it('should create a document and return its ID', async () => {
      const mockAdd = jest.fn().mockResolvedValue({ id: 'newDocID' } as never);
      mockFirestore.collection = jest
        .fn()
        .mockReturnValue({ add: mockAdd }) as jest.MockedFunction<
        Firestore['collection']
      >;

      const result = await repository.create({
        name: 'Test',
      });

      expect(mockAdd).toHaveBeenCalledWith({ name: 'Test' });
      expect(result).toEqual({ id: 'newDocID' });
    });

    it('should throw an error if Firestore operation fails', async () => {
      const mockAdd = jest.fn().mockRejectedValue(new Error('Firestore error') as never);
      mockFirestore.collection = jest
        .fn()
        .mockReturnValue({ add: mockAdd }) as jest.MockedFunction<
        Firestore['collection']
      >;

      await expect(repository.create({ name: 'Test' })).rejects.toEqual({
        message: 'internal server error',
        status: 500,
      });
    });
  });

  describe('update', () => {
    it('should update a document and return the updated data', async () => {
      const mockUpdate = jest.fn().mockResolvedValue({ id: 'docID' } as never);
      const mockDocs = [{ ref: { update: mockUpdate } }];
      mockFirestore.collection = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({ docs: mockDocs } as never),
        }),
      }) as jest.MockedFunction<Firestore['collection']>;

      const result = await repository.update('id', 'docID', { name: 'Test' });

      expect(mockFirestore.collection).toHaveBeenCalledWith('testCollection');
      expect(mockFirestore.collection('testCollection').where).toHaveBeenCalledWith(
        'id',
        '==',
        'docID'
      );
      expect(mockUpdate).toHaveBeenCalledWith({ name: 'Test' });
      expect(result).toEqual({ id: 'docID', name: 'Test' });
    });

    it('should throw an error if Firestore operation fails', async () => {
      const mockUpdate = jest
        .fn()
        .mockRejectedValue(new Error('Firestore error') as never);
      const mockDocs = [{ ref: { update: mockUpdate } }];
      mockFirestore.collection = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({ docs: mockDocs } as never),
        }),
      }) as jest.MockedFunction<Firestore['collection']>;

      await expect(repository.update('id', 'docID', { name: 'Test' })).rejects.toEqual({
        message: 'internal server error',
        status: 500,
      });
    });
  });

  describe('delete', () => {
    it('should delete a document', async () => {
      const mockDelete = jest.fn().mockResolvedValue({} as never);
      const mockDocs = [{ ref: { delete: mockDelete } }];
      mockFirestore.collection = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({ docs: mockDocs } as never),
        }),
      }) as jest.MockedFunction<Firestore['collection']>;

      await repository.delete('id', 'docID');

      expect(mockFirestore.collection).toHaveBeenCalledWith('testCollection');
      expect(mockFirestore.collection('testCollection').where).toHaveBeenCalledWith(
        'id',
        '==',
        'docID'
      );
      expect(mockDelete).toHaveBeenCalled();
    });

    it('should throw an error if Firestore operation fails', async () => {
      const mockDelete = jest
        .fn()
        .mockRejectedValue(new Error('Firestore error') as never);
      const mockDocs = [{ ref: { delete: mockDelete } }];
      mockFirestore.collection = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({ docs: mockDocs } as never),
        }),
      }) as jest.MockedFunction<Firestore['collection']>;

      await expect(repository.delete('id', 'docID')).rejects.toEqual({
        message: 'internal server error',
        status: 500,
      });
    });
  });

  describe('find', () => {
    it('should return a document by ID', async () => {
      const mockDocData = { name: 'Test', id: 'docID' };
      const getMock = jest.fn().mockResolvedValue({
        data: () => mockDocData,
      } as never);
      mockFirestore.collection = jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({ get: getMock }),
      }) as jest.MockedFunction<Firestore['collection']>;

      const result = await repository.find('docID');

      expect(mockFirestore.collection).toHaveBeenCalledWith('testCollection');
      expect(mockFirestore.collection('testCollection').doc).toHaveBeenCalledWith(
        'docID'
      );
      expect(getMock).toHaveBeenCalled();
      expect(result).toEqual(mockDocData);
    });

    it('should throw an error if Firestore operation fails', async () => {
      const mockGet = jest.fn().mockRejectedValue(new Error('Firestore error') as never);
      mockFirestore.collection = jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({ get: mockGet }),
      }) as jest.MockedFunction<Firestore['collection']>;

      await expect(repository.find('docID')).rejects.toEqual({
        message: 'internal server error',
        status: 500,
      });
    });
  });

  describe('findBy', () => {
    it('should return a document by field value', async () => {
      const mockDocData = { name: 'Test', id: 'docID' };
      const mockDocs = [{ data: () => mockDocData }];
      mockFirestore.collection = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({ docs: mockDocs } as never),
        }),
      }) as jest.MockedFunction<Firestore['collection']>;

      const result = await repository.findBy('id', 'idTest');

      expect(mockFirestore.collection).toHaveBeenCalledWith('testCollection');
      expect(mockFirestore.collection('testCollection').where).toHaveBeenCalledWith(
        'id',
        '==',
        'idTest'
      );
      expect(result).toEqual(mockDocData);
    });

    it('should throw an error if Firestore operation fails', async () => {
      mockFirestore.collection = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({ empty: true } as never),
        }),
      }) as jest.MockedFunction<Firestore['collection']>;

      await expect(repository.findBy('id', 'idTest')).rejects.toEqual({
        message: 'bad request',
        status: 400,
      });
    });
  });

  describe('findAllBy', () => {
    it('should return all documents by field value', async () => {
      const mockDocData = { name: 'Test', id: 'docID' };
      const mockDocs = [{ data: () => ({ name: 'Test', id: 'docID' }) }];
      mockFirestore.collection = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue(mockDocs as never),
        }),
      }) as jest.MockedFunction<Firestore['collection']>;

      const result = await repository.findAllBy('id', 'idTest');

      expect(mockFirestore.collection).toHaveBeenCalledWith('testCollection');
      expect(mockFirestore.collection('testCollection').where).toHaveBeenCalledWith(
        'id',
        '==',
        'idTest'
      );
      expect(result).toEqual([mockDocData]);
    });

    it('should throw an error if Firestore operation fails', async () => {
      mockFirestore.collection = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({ empty: true } as never),
        }),
      }) as jest.MockedFunction<Firestore['collection']>;

      await expect(repository.findAllBy('id', 'idTest')).rejects.toEqual({
        message: 'not found',
        status: 404,
      });
    });
  });

  describe('findAll', () => {
    it('should return all documents', async () => {
      const mockDocs = [{ data: () => ({ name: 'Test', id: 'docID' }) }];
      mockFirestore.collection = jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue([{ name: 'Test' }] as never),
      }) as jest.MockedFunction<Firestore['collection']>;

      const result = await repository.findAll();

      expect(mockFirestore.collection).toHaveBeenCalledWith('testCollection');
      expect(result).toEqual([{ name: 'Test' }]);
    });

    it('should throw an error if Firestore operation fails', async () => {
      mockFirestore.collection = jest.fn().mockReturnValue({
        get: jest.fn().mockRejectedValue(new Error('Firestore error') as never),
      }) as jest.MockedFunction<Firestore['collection']>;

      await expect(repository.findAll()).rejects.toEqual({
        message: 'internal server error',
        status: 500,
      });
    });
  });

  describe('findAllByDateAndID', () => {
    it('should return all documents by field value and date range', async () => {
      const mockDocData = { name: 'Test', id: 'docID' };
      const mockDocs = [{ data: () => ({ name: 'Test', id: 'docID' }) }];
      mockFirestore.collection = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              get: jest.fn().mockResolvedValue(mockDocs as never),
            }),
          }),
        }),
      }) as jest.MockedFunction<Firestore['collection']>;

      const result = await repository.findAllByDateAndID(
        'id',
        'idTest',
        'date',
        new Date(2021, 0, 1),
        new Date(2021, 0, 31)
      );

      expect(mockFirestore.collection).toHaveBeenCalledWith('testCollection');
      expect(mockFirestore.collection('testCollection').where).toHaveBeenCalledWith(
        'id',
        '==',
        'idTest'
      );
      expect(result).toEqual([mockDocData]);
    });

    it('should throw an error if Firestore operation fails', async () => {
      mockFirestore.collection = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              get: jest.fn().mockResolvedValue({ empty: true } as never),
            }),
          }),
        }),
      }) as jest.MockedFunction<Firestore['collection']>;

      await expect(
        repository.findAllByDateAndID(
          'id',
          'idTest',
          'date',
          new Date(2021, 0, 1),
          new Date(2021, 0, 31)
        )
      ).rejects.toEqual({
        message: 'not found',
        status: 404,
      });
    });
  });
});
