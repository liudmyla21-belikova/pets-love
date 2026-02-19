import { NextResponse } from 'next/server';
import { apiWithAuth } from '../../api';
import { isAxiosError } from 'axios';

export async function GET() {
  try {
    const api = await apiWithAuth();
    const res = await api.get('/users/current');
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status },
      );
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
