//a file with types for the project

export type BingoItem = {
    id: string;
    item: string;
    description: string;
    count: number;
    isChecked: boolean;
    };

export type BingoSheet = {
  //id: string; //needs to be returned from firebase
  name: string;
  items: BingoItem[];
  timeStarted: string;  
  bingo: boolean;
};

export type User = {
  id: string;
  name: string;
  score: number;
};