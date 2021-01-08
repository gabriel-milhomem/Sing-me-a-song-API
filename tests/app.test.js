require('dotenv').config();

const supertest = require('supertest');
const app = require('../src/app');
const agent = supertest(app);

const { Pool } = require('pg');
const sequelize = require('../src/utils/database');

const db = new Pool({
    connectionString: process.env.DATABASE_URL
})

beforeAll(async () => {
    await db.query('DELETE FROM "genresRecommendations"');
    await db.query('DELETE FROM genres');
    await db.query('DELETE FROM recommendations');
});

afterAll(async () => {
    await db.end();
    await sequelize.close();
})

let listGenresIds = [];
let listSongsIds = [];

describe('POST /genres', () => {
    it('should return status 422 -> error not a name genre param', async () => {

        const response = await agent.post('/genres');

        expect(response.status).toBe(422);
    });

    it('should return status 409 -> error genre is already registered', async () => {
        const body = {
            name: 'forró'
        }

        await db.query('INSERT INTO genres (name) VALUES ($1)', [
            'forró'
        ]);

        const response = await agent.post('/genres').send(body);

        expect(response.status).toBe(409);
    });

    it('should return status 201 -> create genre in database', async () => {
        const body = {
            name: 'arrocha'
        }

        const response = await agent.post('/genres').send(body);

        const queryResult = await db.query('SELECT * FROM genres WHERE name = $1', [
            body.name
        ]);

        const genre = queryResult.rows[0];

        expect(response.status).toBe(201);
        expect(genre).toEqual(expect.objectContaining(body));
    });
});

describe('GET /genres', () => {
    it('should return status 200 and all genres list in alphabetic order', async () => {
        await db.query('INSERT INTO genres (name) VALUES ($1)', [
           'eletrônica' 
        ]);

        const response = await agent.get('/genres');

        const queryResult = await db.query('SELECT * FROM genres ORDER BY name ASC');
        const failQuery = await db.query('SELECT * FROM genres');
        const allGenres = queryResult.rows;
        const genresNotAlphabetic = failQuery.rows;

        expect(response.status).toBe(200);
        expect(response.body).toEqual(allGenres);
        expect(response.body).not.toEqual(genresNotAlphabetic);

        listGenresIds = allGenres.map(genre => genre.id);
        console.log(listGenresIds, 'GENRES ID NO TESTE');
    });
});

describe('POST /recommendations', () => {
    it('should return status 422 -> error not a name recommendation param', async () => {
        const body = {
            genresIds: [1, 2],
            youtubeLink: 'https://www.youtube.com/watch?v=5qap5aO4i9A'
        }

        const response = await agent.post('/recommendations').send(body);

        expect(response.status).toBe(422);
    });

    it('should return status 422 -> error not a youtube link param', async () => {
        const body = {
            name: 'lofi hip hop radio',
            genresIds: [1, 2],
            youtubeLink: 'https://www.google.com/'
        }

        const response = await agent.post('/recommendations').send(body);

        expect(response.status).toBe(422);
    });

    it('should return status 422 -> error genresId at lest one number', async () => {
        const body = {
            name: 'lofi hip hop radio',
            genresIds: [],
            youtubeLink: 'https://www.youtube.com/watch?v=5qap5aO4i9A'
        }

        const response = await agent.post('/recommendations').send(body);

        expect(response.status).toBe(422);
    });

    it('should return status 409 -> error music recommendation is already registered (same link)', async () => {
        const body = {
            name: 'lo-fi',
            genresIds: [5, 9],
            youtubeLink: 'https://www.youtube.com/watch?v=5qap5aO4i9A'
        }

        await db.query('INSERT INTO recommendations (name, "youtubeLink") VALUES ($1, $2)', [
            'lo-fi hip hop radio', body.youtubeLink
        ]);

        const response = await agent.post('/recommendations').send(body);

        expect(response.status).toBe(409);
    });

    it('should return status 403 -> error at least one genre is invalid', async () => {
        const body = {
            name: 'Falamansa - Xote dos Milagres',
            genresIds: [listGenresIds[0], 99999],
            youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y'
        }

        const response = await agent.post('/recommendations').send(body);

        expect(response.status).toBe(403);
    });

    it('should return status 201 -> create a recommendation song with all genreIds valid', async () => {
        const youtubeLink = 'www.youtube.com/watch?v=chwyjJbcs1Y';
        const body = {
            name: 'Falamansa - Xote dos Milagres',
            genresIds: [listGenresIds[0], listGenresIds[1]],
            youtubeLink
        }

        const response = await agent.post('/recommendations').send(body);

        const songResult = await db.query(
            'SELECT * FROM recommendations WHERE "youtubeLink" = $1', [youtubeLink]
        );
        const song = songResult.rows[0];

        console.log('SONG', song);

        listSongsIds.push(song.id);

        const relationship = await db.query(
            'SELECT * FROM "genresRecommendations" WHERE "recommendationId" = $1', [
                listSongsIds[0]
            ]
        );

        expect(response.status).toBe(201);
        expect(song).toEqual(
            expect.objectContaining({
                name: body.name,
                youtubeLink
            })
        );

        expect(relationship.rows).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    genreId: listGenresIds[0],
                    recommendationId: song.id
                }),
                expect.objectContaining({
                    genreId: listGenresIds[1],
                    recommendationId: song.id
                })
            ])
        );
    });
});

describe('POST /recommendations/:id/upvote', () => {
    it('should return 404 -> error invalid recommendation id', async () => {
        const response = await agent.post('/recommendations/23434/upvote');

        expect(response.status).toBe(404);
    });

    it('should return 200 -> add one in the score', async () => {
        const response = await agent.post(`/recommendations/${listSongsIds[0]}/upvote`);

        const songResult = await db.query(
            'SELECT * FROM recommendations WHERE id = $1', [
                listSongsIds[0]
            ]
        );

        const score = songResult.rows[0].score;

        expect(response.status).toBe(200);
        expect(score).toEqual(1);
    })
});

describe('POST /recommendations/:id/downvote', () => {
    it('should return 404 -> error invalid recommendation id', async () => {
        const response = await agent.post('recommendations/34234/downvote');

        expect(response.status).toBe(404);
    });

    it('should return 200 -> subtract one in the score', async () => {
        const insertSongRequest = await db.query(
            'INSERT INTO recommendations (name, "youtubeLink", score) VALUES ($1, $2, $3) RETURNING *', [
                'Linkin Park - Numb', 'youtube.com/watch?v=kXYiU_JCYtU', 5
            ]
        );

        listSongsIds.push(insertSongRequest.rows[0].id);

        console.log(listSongsIds, 'SONGSIDS');

        const response = await agent.post(`/recommendations/${listSongsIds[1]}/downvote`);

        const songResult = await db.query(
            'SELECT * FROM recommendations WHERE id = $1', [
                listSongsIds[1]
            ]
        );

        const score = songResult.rows[0].score;

        expect(response.status).toBe(200);
        expect(score).toEqual(4);
    });

    it('should return 200 -> more then -5 votes and the recommendation is deleted', async () => {
        const song = await db.query(
            'UPDATE recommendations SET score = $1 WHERE id = $2 RETURNING *', [
                -5 , listSongsIds[1]
            ]
        );

        const response = await agent.post(`/recommendations/${listSongsIds[1]}/downvote`);

        const songsRequest = await db.query('SELECT * FROM recommendations');

        expect(response.status).toBe(200);
        expect(songsRequest.rows).not.toEqual(
            expect.objectContaining(song.rows[0])
        );
    });
});