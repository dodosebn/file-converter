
const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="px-4">
      <div className=" py-8 flex-wrap text-center dark:text-gray-400">
        © {year} FastConvert. Made with ❤️ by{" "}
        <a
          href="https://orji-dominion.vercel.app/"
          className="underline hover:text-blue-600 transition-colors"
        >
          DOMINION
        </a>
      </div>
    </footer>
  )
}

export default Footer
