import request from 'supertest';
import app from '../src/server.js';
import { surchargeDefault } from '../src/config/surchargeRegulations.js'; 

describe('SETTINGS & REGULATION API', () => {

    // Test case 9: Successfully Update Surcharge Regulations 
    test('PUT /api/settings/surcharge - Should update surcharge rates', async () => {
        const newRates = {
            foreignGuest: 2.0, // Double the rate
            extraPerson: 2.0,
            holiday: 2.0
        };

        const res = await request(app)
            .put('/api/settings/surcharge')
            .send(newRates);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

        expect(res.body.data.data.foreignGuest).toBe(2.0);
    });

    // Test case 10: Restore Default Regulations 
    test('POST /api/settings/surcharge/reset - Should restore default values', async () => {
        const res = await request(app).post('/api/settings/surcharge/reset');

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        
        // Verify that returned data matches the default values
        expect(res.body.data.data.foreignGuest).toBe(surchargeDefault.foreignGuest);
        expect(res.body.data.data.extraPerson).toBe(surchargeDefault.extraPerson);
    });
});