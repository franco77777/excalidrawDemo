const Pencil = ({ setTool, tool }) => {
  return (
    <>
      <div
        onClick={() => setTool("pencil")}
        className={`${
          tool === "pencil" ? "mt-0 text-blue-500" : "mt-6"
        } duration-300 ease-in-out cursor-pointer hover:mt-0 `}
      >
        <svg
          width="36"
          height="61"
          viewBox="0 0 36 61"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          id="edgeless-pen-icon"
        >
          <g filter="url(#filter0_d_8344_17221)">
            <path
              d="M8.00024 40.8966L12.283 39.469V108.538H8.00024V40.8966Z"
              fill="currentColor"
            ></path>
            <path
              d="M8.00024 40.8966L12.283 39.469V108.538H8.00024V40.8966Z"
              fill="white"
              fill-opacity="0.1"
            ></path>
            <path
              d="M12.283 38.9929H17.5174V108.538H12.283V38.9929Z"
              fill="currentColor"
            ></path>
            <path
              d="M17.5175 38.9929H22.7519V108.538H17.5175V38.9929Z"
              fill="currentColor"
            ></path>
            <path
              d="M17.5175 38.9929H22.7519V108.538H17.5175V38.9929Z"
              fill="black"
              fill-opacity="0.1"
            ></path>
            <path
              d="M22.752 32.9448L27.0347 40.8965V108.538H22.752V32.9448Z"
              fill="currentColor"
            ></path>
            <path
              d="M22.752 32.9448L27.0347 40.8965V108.538H22.752V32.9448Z"
              fill="black"
              fill-opacity="0.2"
            ></path>
            <path
              d="M16.5909 4.88078C16.8233 3.90625 18.2099 3.90623 18.4423 4.88075L19.896 10.9741L22.2755 20.9483L27.0345 40.8965L23.9871 40.0231C23.1982 39.7969 22.3511 39.9039 21.6431 40.3189L18.023 42.4414C17.7107 42.6245 17.3238 42.6245 17.0115 42.4414L13.0218 40.1023C12.5499 39.8256 11.9851 39.7543 11.4592 39.905L8 40.8965L12.7583 20.9483L15.1374 10.9741L16.5909 4.88078Z"
              fill="#F1F1F1"
            ></path>
            <path
              d="M16.5909 4.88078C16.8233 3.90625 18.2099 3.90623 18.4423 4.88075L19.896 10.9741L22.2755 20.9483L27.0345 40.8965L23.9871 40.0231C23.1982 39.7969 22.3511 39.9039 21.6431 40.3189L18.023 42.4414C17.7107 42.6245 17.3238 42.6245 17.0115 42.4414L13.0218 40.1023C12.5499 39.8256 11.9851 39.7543 11.4592 39.905L8 40.8965L12.7583 20.9483L15.1374 10.9741L16.5909 4.88078Z"
              fill="url(#paint0_linear_8344_17221)"
              fill-opacity="0.1"
            ></path>
            <g filter="url(#filter1_b_8344_17221)">
              <path
                d="M16.5915 4.88076C16.824 3.90624 18.2106 3.90625 18.443 4.88077L20.3725 12.969H14.6621L16.5915 4.88076Z"
                fill="currentColor"
              ></path>
            </g>
          </g>
          <defs>
            <filter
              id="filter0_d_8344_17221"
              x="0"
              y="-3"
              width="35.0347"
              height="123.538"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              ></feColorMatrix>
              <feOffset dy="4"></feOffset>
              <feGaussianBlur stdDeviation="4"></feGaussianBlur>
              <feComposite in2="hardAlpha" operator="out"></feComposite>
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.22 0"
              ></feColorMatrix>
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_8344_17221"
              ></feBlend>
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_8344_17221"
                result="shape"
              ></feBlend>
            </filter>
            <filter
              id="filter1_b_8344_17221"
              x="12.7587"
              y="2.24645"
              width="9.51722"
              height="12.626"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feGaussianBlur
                in="BackgroundImageFix"
                stdDeviation="0.951724"
              ></feGaussianBlur>
              <feComposite
                in2="SourceAlpha"
                operator="in"
                result="effect1_backgroundBlur_8344_17221"
              ></feComposite>
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_backgroundBlur_8344_17221"
                result="shape"
              ></feBlend>
            </filter>
            <linearGradient
              id="paint0_linear_8344_17221"
              x1="22.1949"
              y1="21.2552"
              x2="16.9439"
              y2="22.5016"
              gradientUnits="userSpaceOnUse"
            >
              <stop></stop>
              <stop offset="0.302413" stop-opacity="0"></stop>
              <stop offset="0.557292" stop-opacity="0"></stop>
              <stop offset="1" stop-opacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  );
};
export default Pencil;
