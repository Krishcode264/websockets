


export type UserSchemaType = {
  name: string; 
  createdAt:Date;
  id: string; 
  socketID: string;
  isConnected: boolean; 
  country?: string; 
  intrests?: string[]; 
  age?: number; 
  gender?: string; 
};

