const ImageBar = ({ setTool }) => {
  const openInputFile = (e) => {
    e.preventDefault();
    const input = document.getElementById("inputFile");
    setTool("image");
    input.click();
  };

  return (
    <>
      <div
        onClick={(e) => openInputFile(e)}
        className="hover:scale-110 relative duration-300 ease-in-out cursor-pointer"
      >
        <svg
          width="66"
          height="50"
          viewBox="0 0 66 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_3760_84867)">
            <g clip-path="url(#clip0_3760_84867)">
              <g clip-path="url(#clip1_3760_84867)">
                <g opacity="0.8" filter="url(#filter1_f_3760_84867)">
                  <ellipse
                    cx="18.0344"
                    cy="24.2565"
                    rx="18.0344"
                    ry="24.2565"
                    transform="matrix(-0.155936 -0.987767 0.999908 0.0135939 13.7056 34.4636)"
                    fill="#FFCFAC"
                  ></ellipse>
                </g>
                <g opacity="0.8" filter="url(#filter2_f_3760_84867)">
                  <ellipse
                    cx="19.6507"
                    cy="19.8311"
                    rx="19.6507"
                    ry="19.8311"
                    transform="matrix(-0.409404 -0.912353 0.978013 -0.208546 8.12207 36.8379)"
                    fill="#FF7715"
                  ></ellipse>
                </g>
                <g opacity="0.8" filter="url(#filter3_f_3760_84867)">
                  <path
                    d="M63.5789 9.77916C72.9851 18.853 56.3243 47.3862 52.5954 44.2186C50.3206 42.2863 50.0377 31.0205 43.0574 24.3547C38.5951 20.0935 28.6749 19.6723 22.6336 18.3699C7.14186 15.0301 54.0943 0.629664 63.5789 9.77916Z"
                    fill="#DDBC68"
                  ></path>
                </g>
              </g>
            </g>
            <rect
              x="0.62962"
              y="1.09053"
              width="49.6656"
              height="33.0444"
              rx="3.56167"
              transform="matrix(0.965926 0.258818 -0.25882 0.965926 13.0395 3.55023)"
              stroke="#E3E2E4"
              stroke-width="1.78084"
            ></rect>
            <path
              d="M19.8753 18.8153C19.2887 21.0045 20.6767 23.2781 22.975 23.8939C25.2732 24.5097 27.612 23.2347 28.1986 21.0455C28.7852 18.8563 27.3973 16.5827 25.099 15.9669C22.8007 15.3511 20.4619 16.6261 19.8753 18.8153Z"
              fill="url(#paint0_linear_3760_84867)"
            ></path>
            <path
              d="M39.5992 38.4261L39.23 39.8041C38.985 40.7181 38.8256 41.308 38.6667 41.7469C38.5143 42.1677 38.4088 42.3105 38.3459 42.3777C38.1064 42.6332 37.7867 42.8075 37.4328 42.8756C37.3398 42.8935 37.1561 42.9083 36.6944 42.8223C36.2129 42.7326 35.5929 42.5678 34.6331 42.3107L18.6523 38.0286C17.6925 37.7714 17.0731 37.6042 16.6113 37.4411C16.1685 37.2847 16.0169 37.1801 15.9453 37.1181C15.6728 36.8821 15.4831 36.5714 15.4034 36.2303C15.3825 36.1407 15.3626 35.9642 15.441 35.5236C15.5228 35.0641 15.6797 34.4735 15.9246 33.5595L17.0846 29.2304C17.1673 29.1894 17.2483 29.1503 17.3276 29.1134C17.9411 28.8273 18.5874 28.5994 19.3224 28.561C20.4178 28.5038 21.5121 28.7842 22.4456 29.3613C23.0721 29.7486 23.53 30.2594 23.9312 30.8055C24.1946 31.1639 24.4705 31.5905 24.7719 32.0732L26.8414 30.956C27.6317 30.5292 28.3131 30.1614 28.9008 29.9035C29.5206 29.6315 30.1719 29.4181 30.9073 29.3957C32.0034 29.3623 33.0905 29.6657 34.0102 30.2615C34.6274 30.6613 35.0734 31.1808 35.462 31.7342C35.462 31.7342 38.226 36.2071 39.5992 38.4261Z"
              fill="url(#paint1_linear_3760_84867)"
            ></path>
          </g>
          <g filter="url(#filter4_d_3760_84867)">
            <rect
              x="5.67139"
              y="9.23291"
              width="52.5347"
              height="35.6167"
              rx="4.45209"
              fill="white"
              shape-rendering="crispEdges"
            ></rect>
            <g clip-path="url(#clip2_3760_84867)">
              <g clip-path="url(#clip3_3760_84867)">
                <g opacity="0.8" filter="url(#filter5_f_3760_84867)">
                  <ellipse
                    cx="18.0344"
                    cy="24.2565"
                    rx="18.0344"
                    ry="24.2565"
                    transform="matrix(-0.406276 -0.91375 0.969355 -0.245664 15.2515 39.2395)"
                    fill="#5076FF"
                  ></ellipse>
                </g>
                <g opacity="0.8" filter="url(#filter6_f_3760_84867)">
                  <ellipse
                    cx="19.6507"
                    cy="19.8312"
                    rx="19.6507"
                    ry="19.8312"
                    transform="matrix(-0.631588 -0.775304 0.890712 -0.454568 10.4727 42.9778)"
                    fill="#77FFCE"
                  ></ellipse>
                </g>
                <g opacity="0.8" filter="url(#filter7_f_3760_84867)">
                  <path
                    d="M57.0367 2.48772C68.4709 8.81785 59.7628 40.691 55.3411 38.5964C52.6437 37.3187 49.4547 26.51 40.9869 21.878C35.5738 18.9169 25.8826 21.0775 19.71 21.3831C3.88181 22.1667 45.5072 -3.89522 57.0367 2.48772Z"
                    fill="#35B7E0"
                  ></path>
                </g>
              </g>
            </g>
            <rect
              x="6.5618"
              y="10.1231"
              width="50.7539"
              height="33.8358"
              rx="3.56167"
              stroke="#E3E2E4"
              stroke-width="1.78084"
            ></rect>
            <path
              d="M17.1606 22.5276C17.1606 24.7941 19.0897 26.6309 21.4691 26.6309C23.8484 26.6309 25.7776 24.7941 25.7776 22.5276C25.7776 20.2612 23.8484 18.4243 21.4691 18.4243C19.0897 18.4243 17.1606 20.2612 17.1606 22.5276Z"
              fill="url(#paint2_linear_3760_84867)"
            ></path>
            <path
              d="M41.2881 36.3653L41.2881 37.7919C41.2881 38.7382 41.2867 39.3492 41.2468 39.8143C41.2086 40.2602 41.1437 40.4255 41.1002 40.5066C40.935 40.8155 40.6714 41.0666 40.3471 41.2239C40.2619 41.2653 40.0883 41.3271 39.6201 41.3635C39.1318 41.4015 38.4902 41.4028 37.4966 41.4028H20.9521C19.9584 41.4028 19.3169 41.4015 18.8286 41.3635C18.3604 41.3271 18.1868 41.2653 18.1016 41.2239C17.7773 41.0666 17.5137 40.8155 17.3484 40.5066C17.305 40.4255 17.2401 40.2602 17.2018 39.8143C17.1619 39.3492 17.1606 38.7382 17.1606 37.7919L17.1606 33.3102C17.2299 33.2491 17.2981 33.1904 17.3651 33.1342C17.8836 32.6991 18.4489 32.3117 19.149 32.0844C20.1922 31.7456 21.3217 31.7333 22.3729 32.0491C23.0782 32.261 23.6527 32.6359 24.1816 33.0595C24.5288 33.3376 24.9057 33.6783 25.3218 34.0665L27.0315 32.4517C27.6845 31.8349 28.2474 31.3033 28.7484 30.902C29.2767 30.4789 29.8506 30.1042 30.5552 29.8922C31.6052 29.5763 32.7338 29.5879 33.7764 29.9254C34.476 30.1519 35.0412 30.5383 35.5598 30.9722C35.5598 30.9722 39.3873 34.5773 41.2881 36.3653Z"
              fill="url(#paint3_linear_3760_84867)"
            ></path>
          </g>
          <defs>
            <filter
              id="filter0_d_3760_84867"
              x="-0.561671"
              y="-0.561671"
              width="67.0862"
              height="55.1233"
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
              <feOffset></feOffset>
              <feGaussianBlur stdDeviation="1.78084"></feGaussianBlur>
              <feComposite in2="hardAlpha" operator="out"></feComposite>
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.258824 0 0 0 0 0.254902 0 0 0 0 0.286275 0 0 0 0.14 0"
              ></feColorMatrix>
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_3760_84867"
              ></feBlend>
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_3760_84867"
                result="shape"
              ></feBlend>
            </filter>
            <filter
              id="filter1_f_3760_84867"
              x="1.23073"
              y="-10.3352"
              width="67.834"
              height="54.6294"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              ></feBlend>
              <feGaussianBlur
                stdDeviation="4.74889"
                result="effect1_foregroundBlur_3760_84867"
              ></feGaussianBlur>
            </filter>
            <filter
              id="filter2_f_3760_84867"
              x="-11.0286"
              y="-13.1272"
              width="61.0014"
              height="55.802"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              ></feBlend>
              <feGaussianBlur
                stdDeviation="4.7489"
                result="effect1_foregroundBlur_3760_84867"
              ></feGaussianBlur>
            </filter>
            <filter
              id="filter3_f_3760_84867"
              x="10.0266"
              y="-2.71654"
              width="65.8896"
              height="56.6772"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              ></feBlend>
              <feGaussianBlur
                stdDeviation="4.7489"
                result="effect1_foregroundBlur_3760_84867"
              ></feGaussianBlur>
            </filter>
            <filter
              id="filter4_d_3760_84867"
              x="2.10972"
              y="5.67099"
              width="59.658"
              height="42.7403"
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
              <feOffset></feOffset>
              <feGaussianBlur stdDeviation="1.78084"></feGaussianBlur>
              <feComposite in2="hardAlpha" operator="out"></feComposite>
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.258824 0 0 0 0 0.254902 0 0 0 0 0.286275 0 0 0 0.14 0"
              ></feColorMatrix>
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_3760_84867"
              ></feBlend>
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_3760_84867"
                result="shape"
              ></feBlend>
            </filter>
            <filter
              id="filter5_f_3760_84867"
              x="-2.69506"
              y="-10.2244"
              width="68.2656"
              height="54.0517"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              ></feBlend>
              <feGaussianBlur
                stdDeviation="4.74889"
                result="effect1_foregroundBlur_3760_84867"
              ></feGaussianBlur>
            </filter>
            <filter
              id="filter6_f_3760_84867"
              x="-15.3625"
              y="-8.47509"
              width="62.1758"
              height="54.406"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              ></feBlend>
              <feGaussianBlur
                stdDeviation="4.7489"
                result="effect1_foregroundBlur_3760_84867"
              ></feGaussianBlur>
            </filter>
            <filter
              id="filter7_f_3760_84867"
              x="6.66676"
              y="-8.01757"
              width="65.5259"
              height="56.2104"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              ></feBlend>
              <feGaussianBlur
                stdDeviation="4.7489"
                result="effect1_foregroundBlur_3760_84867"
              ></feGaussianBlur>
            </filter>
            <linearGradient
              id="paint0_linear_3760_84867"
              x1="32.59"
              y1="17.9741"
              x2="26.6427"
              y2="40.1696"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.578125" stop-color="white"></stop>
              <stop offset="1" stop-color="white" stop-opacity="0"></stop>
            </linearGradient>
            <linearGradient
              id="paint1_linear_3760_84867"
              x1="32.59"
              y1="17.9741"
              x2="26.6427"
              y2="40.1696"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.578125" stop-color="white"></stop>
              <stop offset="1" stop-color="white" stop-opacity="0"></stop>
            </linearGradient>
            <linearGradient
              id="paint2_linear_3760_84867"
              x1="29.2243"
              y1="18.4243"
              x2="29.2243"
              y2="41.4028"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.578125" stop-color="white"></stop>
              <stop offset="1" stop-color="white" stop-opacity="0"></stop>
            </linearGradient>
            <linearGradient
              id="paint3_linear_3760_84867"
              x1="29.2243"
              y1="18.4243"
              x2="29.2243"
              y2="41.4028"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.578125" stop-color="white"></stop>
              <stop offset="1" stop-color="white" stop-opacity="0"></stop>
            </linearGradient>
            <clipPath id="clip0_3760_84867">
              <rect
                width="51.4464"
                height="34.8252"
                rx="4.45209"
                transform="matrix(0.965926 0.258818 -0.25882 0.965926 12.7358 3.67603)"
                fill="white"
              ></rect>
            </clipPath>
            <clipPath id="clip1_3760_84867">
              <rect
                width="51.4464"
                height="34.8252"
                fill="white"
                transform="matrix(0.965926 0.258818 -0.25882 0.965926 12.7358 3.67603)"
              ></rect>
            </clipPath>
            <clipPath id="clip2_3760_84867">
              <rect
                x="5.67139"
                y="9.23267"
                width="52.5347"
                height="35.6167"
                rx="4.45209"
                fill="white"
              ></rect>
            </clipPath>
            <clipPath id="clip3_3760_84867">
              <rect
                width="51.4464"
                height="34.8252"
                fill="white"
                transform="translate(6.34619 9.75171)"
              ></rect>
            </clipPath>
          </defs>
        </svg>
      </div>
    </>
  );
};
export default ImageBar;
