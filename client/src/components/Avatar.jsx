

const Avatar = ({_id, name, online}) => {
  
  const colors = ['bg-green-600', 'bg-red-600', 'bg-blue-600', 'bg-indigo-600', 'bg-purple-600', 
                'bg-pink-600', 'bg-gray-600', 'bg-orange-600', 'bg-yellow-700', 'bg-primary-blue', 'bg-teal-600' ]

    const useridBase10 = parseInt(_id, 16)
    const colorIndex = useridBase10 % colors.length
    const color = colors[colorIndex]
  
    return (
    <figure className={`${color} relative w-10 h-10 rounded-full flex justify-center items-center`}>
        <span className="uppercase text-2xl text-white text-center">{name?.[0]}</span>
        {online && (
          <div className={("absolute bottom-0 h-2 w-2 -right-1 p-[6px] bg-[#2ffa25] rounded-full border-2 border-white")}></div>
        )}
        {!online && (
          <div className={("absolute bottom-0 h-2 w-2 -right-1 p-[6px] bg-gray-400 rounded-full border-2 border-white")}></div>
        )}
        
    </figure>
  )
}

export default Avatar