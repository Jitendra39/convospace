import css from "../../styles/PreviewMessage.module.css";
import { IoMdClose } from "react-icons/io";
import { GiTicTacToe } from "react-icons/gi";
export default function PreviewMessages({
  deletePlayGameIcon,
  handlePlayGame,
}) {
  return (
    <div className={css.MainPreview}>
      <div className={css.previewName} onClick={deletePlayGameIcon}>
        <h6>Play Game</h6>
        <IoMdClose className={css.CloseIcon} />
      </div>
      <div className={css.Emoji} onClick={handlePlayGame}>
        <GiTicTacToe className={css.playgameIcon} />
      </div>
    </div>
  );
}
