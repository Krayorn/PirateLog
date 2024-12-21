import { useState } from "react"

export default function Journal({days}) {
    const [openedPage, setPage] = useState(0)
    
    return (
        <main className="flex h-screen" >
            <div className="w-5/6 h-full bg-cyan-500 flex justify-center items-center">
                {openedPage > -1 && 
                    <Page content={days[openedPage]} />
                }
            </div>
            <div className="w-1/6 h-full bg-yellow-900">
                {
                    days.map((day) => {
                        return <Entry action={() => setPage(day.day-1)} key={day.day} day={day} />
                    })
                }
            </div>
        </main>
    )
}

function Entry({ day, action }) {
    return (
        <div onClick={action} className="h-40 flex justify-center border border-black p-4 bg-yellow-950">
            <div className="w-full h-full flex justify-center items-center border border-black relative bg-yellow-900">
                <div className="absolute w-[110%] h-[20px] rotate-[30deg] bg-yellow-950 z-0"></div>
                <div className="absolute w-[110%] h-[20px] rotate-[-30deg] bg-yellow-950 z-0"></div>
                <h1  className="text-amber-200 text-3xl z-10">Day {day.day}</h1>
            </div>
        </div>
    )
}

function Page({ content }) {
    return (
        <div className="flex flex-col">
            <div class="notch bg-[#a67f55] w-full h-[8px]" ></div>
            <div className="flex" >
                <div className="bg-[#a67f55] w-[10px]  h-[500px]" ></div>
                <div className="py-[15px] pr-[15px] pl-[35px] page_left w-[450px] h-[500px]">
                    {content.text}
                </div>
                <div className="page_right w-[450px] h-[500px] "></div>
                <div className="bg-[#a67f55] w-[10px]  h-[500px]" ></div>
            </div>
            <div class="notch rotate-[180deg] bg-[#a67f55] w-full h-[8px]" ></div>
        </div>
    )
}

// background: radial-gradient(circle, rgba(246,240,228,1) 22%, rgba(218,187,132,1) 90%);