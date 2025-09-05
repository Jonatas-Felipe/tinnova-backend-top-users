export default interface User {
  id: string;
  nome: string;
  email: string;
  rua: string;
  numero: string;
  bairro: string;
  complemento?: string;
  cidade: string;
  estado: string;
  cep: string;
  status?: string;
  is_deleted: boolean;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
