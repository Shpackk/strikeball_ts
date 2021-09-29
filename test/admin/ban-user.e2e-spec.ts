import * as request from 'supertest';
import { Test,TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/db/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('E2E APP TESTS', () => {
  let service: UserService
  let repo: Repository<User>
  let app: INestApplication;
  // let appService = { findAll: () => ['test'] };
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass:Repository
        }
      ]
    })
      // .overrideProvider(AppService)
      // .useValue(appService)
      .compile();
    service = module.get<UserService>(UserService)
    app = moduleRef.createNestApplication();
    await app.init();
  });








  // test(`get user, ban, check if he is banned`, async () => {
  //   const response =
  //     await request(app.getHttpServer())
  //       .post('/auth/register')
  //       .send({ email: 'supertest@gmail.com', name: 'supertest', role: 'user', password: 'supertest' })
  //   expect(response.status).toBeDefined()
  //   expect(response.body).toBeDefined()
  //   expect(response.body).toEqual(expect.any(Object))

  //   const userLogin =
  //     await request(app.getHttpServer())
  //       .post('/auth/login')
  //       .send({ email: "supertest@gmail.com", password: "supertest" })
  //   expect(userLogin.status).toBe(201)
  //   expect(userLogin.body).toEqual(expect.any(Object))
  //   const {id} = userLogin.body

  //   const adminLogin =
  //     await request(app.getHttpAdapter())
  //       .post('/auth/login')
  //       .send({ email: 'admin.google.com', password: 'admin' })
  //   expect(adminLogin.status).toBe(201)
  //   expect(adminLogin.body).toBeDefined()
  //   expect(adminLogin.body).toEqual(expect.any(Object))
  //   const { token } = response.body

  //   const banUser =
  //     await request(app.getHttpServer())
  //       .post(`/user/${id}/ban`)
  //       .set('Authorization',`Bearer ${token}`)
  //       .send({ description: 'missclick', type: 'ban' })
  //   expect(banUser.status).toBeDefined()
  //   expect(banUser.body).toBeDefined()

  //   const bannedLogin =
  //     await request(app.getHttpServer())
  //       .post('/auth/login')
  //       .send({ email: "supertest@gmail.com", password: "supertest" })
  //   expect(bannedLogin.status).toBe(409)
  //   expect(bannedLogin.body).toEqual(expect.any(Object))
  // })


  afterAll(async () => {
    // await request(app.getHttpServer())
    //   .delete('/user/delete')
    //   .send({name: 'supertest'})
    await app.close();
  });
});