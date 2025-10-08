"use client"
import React, { useEffect, useState } from 'react'
import GlobalApi from '../_utils/GlobalApi';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

function CatetegoryList() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const params = useSearchParams()
    useEffect(() => {
        setSelectedCategory(params.get('category'));
    }, [params])

    useEffect(() => {
        getCategory()
    }, [])

    const getCategory = async () => {
        try {
            const resp = await GlobalApi.getCategory();
            const cats = resp?.categories ?? resp ?? [];
            setCategories(Array.isArray(cats) ? cats : []);
        } catch (err) {
            console.error('getCategory error', err);
        }
    }

    return (
        <div>
            <div className="mt-5">
                <Swiper
                    modules={[Navigation]}
                    navigation
                    spaceBetween={15}
                    slidesPerView={2}
                    breakpoints={{
                        640: { slidesPerView: 3 },
                        768: { slidesPerView: 4 },
                        1024: { slidesPerView: 7 },
                    }}
                >
                    {categories && categories.map((cat) => (
                        <SwiperSlide key={cat?.id ?? cat?.name}>
                            <Link href={"?category=" + cat?.name} className={`flex w-40 flex-col cursor-pointer items-center gap-2 border p-4 hover:bg-[#f9e5b8] transition-all hover:scale-95 hover:border-[#2e3082] rounded-xl min-w-28] ${selectedCategory === cat?.name ? 'bg-[#f9e5b8] border-[#2e3082] scale-105' : ''}`}>
                                <Image width={50} height={50} src={cat?.icon?.url || '/logo.png'} alt={cat?.name || 'category image'} />
                                <h2 className='text-[#2e3082] font-bold'>{cat?.name}</h2>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default CatetegoryList
