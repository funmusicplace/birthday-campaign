"use client";

function FieldRadio({ className, label, name, value, required }) {
  return (
    <div className={`relative ${className || ""}`}>
      <input
        className="block absolute inset-0 appearance-none h-full z-[-1]"
        id={`input-${name}-${value}`}
        name={name}
        type="radio"
        required={required}
        value={value}
      />
      <label
        className="block p-2 rounded-md h-full capitalize text-center bg-gray-100 hover:bg-gray-200 border-4 border-white [:checked+&]:border-gray-800 [:checked+&]:font-bold"
        htmlFor={`input-${name}-${value}`}
      >
        {label || value}
      </label>
    </div>
  );
}

export default function Form({ className }) {
  return (
    <form
      className={`bg-white p-4 md:p-8 rounded-lg w-full flex flex-col gap-4 ${className || ""}`}
      id="form"
    >
      <h2>Join the party!</h2>
      <p>
        If you're able, please consider monthly donations for maximum
        sustenance. You can cancel anytime.
      </p>
      <fieldset onChange={(event) => console.log(event)}>
        <legend className="text-sm font-bold">Select a donation type</legend>
        <div className="mt-1 w-full grid grid-cols-2 gap-2">
          <FieldRadio name="type" value="monthly" required />
          <FieldRadio name="type" value="one-time" required />
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-sm font-bold">Select or enter an amount</legend>
        <div className="mt-1 w-full grid grid-cols-3 gap-2">
          <FieldRadio label="$9" name="amount" value="9" required />
          <FieldRadio label="$18" name="amount" value="18" required />
          <FieldRadio label="$36" name="amount" value="36" required />
        </div>
      </fieldset>
      <button className="p-2 rounded-md bg-mi-red hover:bg-black text-white">
        Continue to pay
      </button>
    </form>
  );
}
