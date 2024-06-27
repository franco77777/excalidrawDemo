export interface Point{
    x:number,
    y:number,
}
export interface Elements{
x1?:number,
y1?:number,
x2?:number,
y2?:number,
id:number,
type:string,
text?:string | undefined,
points?: Point []
src?:string,
}

