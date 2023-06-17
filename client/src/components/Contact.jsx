import Avatar from "./Avatar";

const Contact = ({ _id, name, onClick, selected, online }) => {
    return (
        <article
            key={_id}
            className={
                " rounded-sm flex gap-1 items-center cursor-pointer hover:bg-aside-blue duration-500 " +
                (selected && "bg-aside-blue")
            }
            onClick={onClick}
        >
            {selected && (
                <div className="w-2 bg-blue-500 h-12 rounded-r-sm"></div>
            )}
            <figure className="flex gap-2 items-center py-2 pl-4">
                <Avatar
                    online={online}
                    _id={_id}
                    name={name}
                />
                <span className="text-gray-800 text-lg">
                    {name}
                </span>
            </figure>
        </article>
    );
};

export default Contact;
