'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');

describe('GET /apps', ()=>{

  it('should return an array of apps', () => {
    return request(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.not.be.empty;
        const psApp = res.body[0];
        expect(psApp).to.include.all.keys(['App','Category','Rating','Reviews','Size','Installs', 'Type', 'Price',]);
      });
  });

  describe('sort by rating and app', () => {
    it('should return 400 if sort is incorrect', () => {
      return request(app)
        .get('/apps')
        .query({sort: 'Invalid'})
        .expect(400, 'Sort must be one of rating or app');
    });
  
    it('should sort by rating', () => {
      return request(app)
        .get('/apps')
        .query({sort: 'Rating'})
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body).to.be.an('array');
          let i = 0;
          let sorted = true;
          while(sorted && i < res.body.length -1){
            sorted = sorted && res.body[i].Rating >= res.body[i+1].Rating;
            i++;
          }
          expect(sorted).to.be.true;
        });
    });
  });



  describe('sort by genre', () => {

    it.only('should return 400 if genre is NOT acceptable', () => {
      return request(app)
        .get('/apps')
        .query({genre: 'Invalid'})
        .expect(400, 'Genre must be one of Action, Puzzle, Strategy, Casual, Arcade or Card');
    });
  
  
    it('should sort when genre is acceptable', () => {
      return ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card']
        .map(genre => {
          return request(app)
            .get('/apps')
            .query({genre})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
              expect(res.body).to.be.an('array');
              let i = 0;
              let sorted = true;
              while(sorted && i < res.body.length -1){
                sorted = sorted && res.body[i].Genres.includes(genre);
              }
              expect(sorted).to.be.true;
            });
        });
    });
  });
  
});