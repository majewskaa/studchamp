const Dropdown = () => {
    return (
      <div>
        <label className="mt-4">Assign user(s) to as task:</label>

        <button className="  px-4 w-full py-2 flex items-center justify-between  rounded border border-[#828FA340] hover:border-primary cursor-pointer relative ">
          <span className="block">
            <FiChevronDown color="#635FC7" size={24} />
          </span>
        </button>
      </div>
    );
  };