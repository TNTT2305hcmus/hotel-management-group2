import axios from 'axios';

const ROOMS_URL = 'http://localhost:5000/api/rooms';
const LIMIT = 12;

export const fetchListRoomsFollowPage = async (pageNumber, search, type, status) => {
    try{
        const params = new URLSearchParams({
            page: pageNumber,
            limit: LIMIT
        });

        if (search) params.append('search', search);
        if (type) params.append('type', type);
        if (status) params.append('status', status);

        const response = await axios.get(`${ROOMS_URL}?${params.toString()}`);
        return response.data.data || response.data;
    } catch (error) {
        throw error;
    }
}