import { ButtonGroup } from "@/components/ui/button-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { useNavigate } from "react-router";

function Form() {
  const navigate = useNavigate();

  function search(formData: FormData) {
    const subreddit = formData.get("subreddit");
    const year = formData.get("year");
    const month = formData.get("month");
    const day = formData.get("day");
    navigate(`/r/${subreddit}/top/${year}/${month}/${day}`);
  }

  return (
    <form className="grid grid-cols-2 m-auto max-w-3xl" action={search}>
      <InputGroup>
        <InputGroupInput
          name="subreddit"
          placeholder="subreddit"
          className="!pl-1"
          required
        />
        <InputGroupAddon>
          <InputGroupText>r/</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <ButtonGroup className="grid grid-cols-[2fr_1fr_1fr]">
        <InputGroup>
          <InputGroupInput name="year" placeholder="Year" />
        </InputGroup>
        <InputGroup>
          <InputGroupInput name="month" placeholder="Month" />
        </InputGroup>
        <InputGroup>
          <InputGroupInput name="day" placeholder="Day" />
        </InputGroup>
      </ButtonGroup>
      <button className="hidden" type="submit">
        Search
      </button>
    </form>
  );
}

export default Form;
