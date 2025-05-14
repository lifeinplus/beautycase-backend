import { DBManager } from "./DBManager";

const dbManager = new DBManager();

beforeAll(async () => {
    await dbManager.start();
});

afterEach(async () => {
    await dbManager.cleanup();
});

afterAll(async () => {
    await dbManager.stop();
});
