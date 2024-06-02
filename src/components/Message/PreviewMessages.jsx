import css from "../../styles/PreviewMessage.module.css"
import { IoMdClose } from "react-icons/io";
export default function PreviewMessages({emoji, setEmoji}) {
	return(
    <div   className={css.MainPreview}>
    <div className={css.previewName}>
    <h6>Preview</h6>
    <IoMdClose className={css.CloseIcon} onClick={() => {setEmoji(null)}}/>
    </div>
     <div className={css.Emoji}>
     <img src={emoji} alt="not found"/>
     </div>
    </div>
  )
}
