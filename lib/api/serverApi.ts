import { nextServer } from './api';
import { RegisterType } from '@/types/Register';
import { User } from '@/types/User';
import { NewsRequestParams, NewsResponse } from '@/types/News';
import { Friend } from '@/types/Friend';
import { NoticeRequestParams, Notices } from '@/types/Notice';
import { Pet } from '@/types/Pet';
import { LocationFromBackend } from '@/types/Location';

export async function register(params: RegisterType) {
  const response = await nextServer.post<User>('/users/signup', params);
  if (response.data.token) localStorage.setItem('token', response.data.token);
  return response.data;
}

export async function login(params: Pick<RegisterType, 'email' | 'password'>) {
  const response = await nextServer.post<any>('/users/signin', params);
  if (response.data.token) localStorage.setItem('token', response.data.token);
  return response.data;
}

export const logout = async (): Promise<void> => {
  try {
    await nextServer.post('/users/signout');
  } finally {
    localStorage.removeItem('token');
  }
};

export async function getUser() {
  const response = await nextServer.get<User>('/users/current');
  return response.data;
}

export async function getFullUser() {
  const response = await nextServer.get<User>('/users/current/full');
  return response.data;
}

interface EditUserProps {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export async function editUser(params: EditUserProps) {
  const response = await nextServer.patch<User>('/users/current/edit', params);
  return response.data;
}

export interface AddPetProps {
  name: string;
  title: string;
  imgURL: string;
  species: string;
  birthday: string;
  sex: string;
}

export async function addMyPet(petData: any) {
  const response = await nextServer.post('/users/current/pets/add', petData);
  return response.data;
}

export async function removeMypet(id: string) {
  const response = await nextServer.delete<User>(`/users/current/pets/remove/${id}`);
  return response.data;
}

export async function addToFavorites(id: string) {
  const response = await nextServer.post(`/notices/favorites/add/${id}`);
  return response.data;
}

export async function removeFromFavorites(id: string) {
  const response = await nextServer.delete(`/notices/favorites/remove/${id}`);
  return response.data;
}

export async function fetchNotices(params: NoticeRequestParams) {
  const response = await nextServer.get<Notices>('/notices', { params });
  return response.data;
}

export async function fetchOneNotice(id: string) {
  const response = await nextServer.get<Pet>(`/notices/${id}`);
  return response.data;
}

export async function fetchCategories(): Promise<string[]> {
  const response = await nextServer.get<string[]>('/notices/categories');
  return response.data;
}

export async function fetchSex(): Promise<string[]> {
  const response = await nextServer.get<string[]>('/notices/sex');
  return response.data;
}

export async function fetchSpecies(): Promise<string[]> {
  const response = await nextServer.get<string[]>('/notices/species');
  return response.data;
}

export async function fetchNews({ keyword, page, limit }: NewsRequestParams) {
  const response = await nextServer.get<NewsResponse>('/news', { params: { keyword, page, limit } });
  return response.data;
}

export async function fetchFriends() {
  const response = await nextServer.get<Friend[]>('/friends');
  return response.data;
}

export async function fetchLocations(keyword?: string) {
  const response = await nextServer.get<LocationFromBackend[]>('/cities', { params: { keyword } });
  return response.data;
}