import axios from 'axios';

const API = axios.create({
  baseURL: '',
});

export const sendCampaign = (prompt) => API.post('/api/send', { prompt });
export const chatWithAI = (messages) => API.post('/api/chat', { messages });
export const getCampaigns = () => API.get('/api/campaigns');
export const getCampaign = (id) => API.get(`/api/campaigns/${id}`);
export const getCustomers = () => API.get('/api/customers');
export const getCustomerStats = () => API.get('/api/customers/stats/overview');
export const getCampaignStats = () => API.get('/api/campaigns/stats/overview');