// 使用mongodb-memory-server https://github.com/nodkz/mongodb-memory-server
import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// 0. 如果要用 路徑的alias 像是 src/...
//   需要在package.json => jest
//    "moduleNameMapper": {
//      "^src/(.*)": "<rootDir>/../src/$1"
//    }
import { Cat, CatSchema } from 'src/Schema/cat.schema';
import mongoose from 'mongoose';

describe('CatsService', () => {
  let service: CatsService;

  // 1. let 一個 server
  let mongod: MongoMemoryServer;

  beforeEach(async () => {
    // 2. 把server創出來，拿到在memory中的uri
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // 3. 用MonooseModule 原生的 forRootAsync
        MongooseModule.forRootAsync({
          useFactory: async () => ({ uri }),
        }),
        // MongooseModule.forRoot(uri), <= 不可以用此，會卡住
        MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]), // 导入Trade模型
      ],
      providers: [CatsService],
    }).compile();

    service = module.get<CatsService>(CatsService);
  });

  // 4. 每次用完就斷開連結
  afterEach(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('cats service', () => {
    it('should create a cat', async () => {
      const cat = await service.create({ name: 'test' });
      expect(cat).toHaveProperty('_id'); // 見到mongo才有_id
      expect(cat).toEqual(
        expect.objectContaining({
          name: 'test',
        }),
      );
    });

    it('should find all cat', async () => {
      await service.create({ name: 'test1' });
      await service.create({ name: 'test2' });
      const found = await service.getAll();
      expect(found[0]).toEqual(
        expect.objectContaining({
          name: 'test1',
        }),
      );
      expect(found[1]).toEqual(
        expect.objectContaining({
          name: 'test2',
        }),
      );
    });
  });
});
