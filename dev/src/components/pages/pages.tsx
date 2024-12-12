export default function Pages() {
  return (
    <div>
      <div
        className="
        w-20 h-20
        rounded-xs
        border-2 border-neutral-500 
        focus:outline-dashed focus:outline-2 focus:-outline-offset-4"
        tabIndex={0}
        onFocus={() => {
          console.log('on focus');
        }}
      >
        <div>Page 1</div>
      </div>
    </div>
  );
}
