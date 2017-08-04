'use strict';

const assert = require('assert');
const request = require('supertest');
const mm = require('egg-mock');

describe('test/mongoose.test.js', () => {
  let app;
  before(function* () {
    app = mm.app({
      baseDir: 'apps/mongoose-test',
    });
    app2 = mm.app({
      baseDir: 'apps/mongoose-test-custom',
    });
    yield app.ready();
    yield app2.ready();
  });

  after(() => {
    app.close();
    app2.close();
  });
  afterEach(mm.restore);
  afterEach(function* () {
    yield app.model.User.remove({});
  });

  it('should get data from create', function* () {
    app.mockCsrf();

    yield request(app.callback())
    .post('/users')
    .send({ name: 'mongoose' })
    .expect(200);

    const res = yield request(app.callback()).get('/users');
    assert(res.body[0].name === 'mongoose');
  });

  it('should get data from create with capitalized model file name', function* () {
    app.mockCsrf();

    yield request(app.callback())
    .post('/books')
    .send({ name: 'mongoose' })
    .expect(200);

    const res = yield request(app.callback()).get('/books');
    assert(res.body[0].name === 'mongoose');
  });

  it('should not load unformatted mongoose', function* () {
    assert(app.model.other === undefined);
  });

  it('should load custom promise', function* () {
    assert(app.__mongoose.Promise === undefined);
  });

});
