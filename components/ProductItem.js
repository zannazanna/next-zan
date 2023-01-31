import Image from "next/image";
import Link from "next/link";

export default function ProductItem({ product , addToCardHandler}) {
    return (
        <div className="card">
            <Link href={`/product/${product.slug}`}>
                <span>
                    <Image
                        src={product.image}
                        alt={product.name}
                        className="rounded shadow"
                        width={500}
                        height={500}
                        
                    />

                </span>
            </Link>
            <div className="flex flex-col items-center justify-center p-5">
                <Link href={`/product/${product.slug}`}>
                    <h2 className="text-lg">{product.name}</h2>
                </Link>
                <p className="mb-2"> {product.brand}</p>
                <p> ${product.price}</p>
                <button className="primary-button" type="button" onClick={ () =>{
                    addToCardHandler(product)
                }}> add to card</button>
            </div>
        </div>
    )
}