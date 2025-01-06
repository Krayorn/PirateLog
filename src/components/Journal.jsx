import { useState } from "react"

export default function Journal({days}) {
    const [openedPage, setPage] = useState(0)
    
    return (
        <main className="flex h-screen" >
            <div className="h-full w-full bg-cyan-500 flex justify-center items-center">
                {openedPage > -1 && 
                    <Page prev={() => openedPage >= 1 && setPage(openedPage - 1)} next={() => openedPage < days.length - 1 && setPage(openedPage + 1)} content={days[openedPage]} />
                }
            </div>
        </main>
    )
}

function Page({ content, prev, next }) {
    return (
        <div className="flex w-full h-full flex-col items-center justify-center">
            <div class="notch bg-[#a67f55] w-[calc(80%_+_20px)] h-[8px]" ></div>
            <div className="flex w-[calc(80%_+_20px)] h-4/5" >
                <div className="bg-[#a67f55] w-[10px] h-full" ></div>
                <div className="py-[15px] leading-8 relative pr-[15px] pl-[35px] page_left w-1/2 h-full">
                    {content.textL}
                    <span onClick={prev} className="absolute cursor-pointer bottom-[10px] left-[10px]">◀</span>
                </div>
                <div className="relative py-[15px] pl-[15px] pr-[35px] leading-8 page_right w-1/2 h-full">
                    {content.textR}
                    <span onClick={next} className="absolute cursor-pointer bottom-[10px] right-[10px]">▶</span>
                </div>
                <div className="bg-[#a67f55] w-[10px]  h-full" ></div>
            </div>
            <div class="notch rotate-[180deg] w-[calc(80%_+_20px)] bg-[#a67f55] h-[8px]" ></div>
        </div>
    )
}

// background: radial-gradient(circle, rgba(246,240,228,1) 22%, rgba(218,187,132,1) 90%);