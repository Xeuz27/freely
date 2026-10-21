import { useContext } from "react";
import { TimetrackContext } from "../context/timetrackContext";

const useTimetrackContext = () => {
	const context = useContext(TimetrackContext);
	if (!context) {
		throw new Error("useTimetrackContext must be used within TimetrackContextProvider");
	}
	return context;
};

export default useTimetrackContext;
