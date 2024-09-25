export class OrderDto {
  user: number;
  content: { product: number; quantity: number }[];
}
