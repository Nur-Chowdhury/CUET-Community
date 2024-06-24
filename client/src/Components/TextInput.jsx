import React from "react";

const TextInput = React.forwardRef(
  (
    { type, placeholder, styles, label, labelStyles, name },
    ref
  ) => {
    return (
      <div className='w-full flex flex-col mt-2'>
        {label && (
          <p className={`text-ascent-2 text-sm mb-2 ${labelStyles}`}>{label}</p>
        )}

        <div>
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            ref={ref}
            className={`bg-secondary rounded border border-[#66666690] outline-none text-sm text-ascent-1 px-4 py-3 placeholder:text-[#666] ${styles}`}
          />
        </div>
      </div>
    );
  }
);

export default TextInput;