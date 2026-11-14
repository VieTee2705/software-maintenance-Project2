import createApiClient from "./api.service";

class MuonSachService {
  constructor(baseUrl = "/api/yeucaumuonsach") {
    this.api = createApiClient(baseUrl);
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async getHistory(maDocGia) {
    return (await this.api.get(`/history/${maDocGia}`)).data;
  }
}

export default new MuonSachService();
