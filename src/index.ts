import { Options } from "./types/options";

function Displacement_Map(Height: number, Displacement: number, Roughness: number, Power: number): any[] {
    const Points: any[] = [];
    Points[0] = Height / 2 + Math.random() * Displacement * 2 - Displacement;
    Points[Power] = Height / 2 + Math.random() * Displacement * 2 - Displacement;
    Displacement *= Roughness;

    for (let Index = 1; Index < Power; Index *= 2) {
        for (let Point = Power / Index / 2; Point < Power; Point += Power / Index) {
            Points[Point] = (Points[Point - Power / Index / 2] + Points[Point + Power / Index / 2]) / 2;
            Points[Point] += Math.random() * Displacement * 2 - Displacement;
        }

        Displacement *= Roughness;
    }

    return Points;
}

function To_Line(Width: number, Points: any[]): Array<number | any[]> {
    return Points.map((Point: any[], Index: number) => [(Index * Width) / (Points.length - 1), Point]);
}

function To_Path(Width: number, Height: number, Points: any[]) {
    const Starting_Point: any[] = Points.shift();
    let Path: string = `M ${Starting_Point[0]} ${Starting_Point[1]}`;

    Points.forEach((Point: any[]) => {
        Path += ` L ${Point[0]} ${Point[1]}`;
    });

    Path += ` L ${Width} ${Height} L 0 ${Height} Z`;

    return Path;
}

export default function Generate(Options: Options): any[string] {
    const { width, height, iterations, roughness } = Options;
    const Segments: number = Math.pow(2, iterations);
    const Points = To_Line(width, Displacement_Map(height, height / 4, roughness, Segments));
    const Path: string = To_Path(width, height, Points);

    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="none" version="1.1"><path d="${Path}" /></svg>`;
}
