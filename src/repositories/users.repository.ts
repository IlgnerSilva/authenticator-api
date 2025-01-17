import type { UsersCreateInput, Users } from "@/db/schemas/users";

export interface UsersRepository {
	// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
	create(data: UsersCreateInput): Promise<Users | void>;
	findById(id: string): Promise<Users | undefined>;
	findByEmail(email: string): Promise<Users | undefined>;
}

export type UsersRepositoryRequest = UsersCreateInput;
export type UsersRepositoryResponse = Users;
