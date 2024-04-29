import "./dateSelector.css";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { Button, CircularProgress } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DoneIcon from "@mui/icons-material/Done";
import ErrorIcon from "@mui/icons-material/Error";
import { useState } from "react";
import axios from "axios";

export default function DateSelector() {
    const [date, setDate] = useState<dayjs.Dayjs | null>(null); // Explicitly define state type
    const [loading, setLoading] = useState<boolean>(false);
    const [completed, setCompleted] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const handleDateChange = (value: any) => {
        setLoading(false); // Reset loading state
        setCompleted(false); // Reset completed state
        setError(false); // Reset error state
        // const dateValue = value.format("DD-MM-YYYY")
        if (value !== null || value !== undefined) {
            setDate(value);
            value !== undefined
                ? "No date Selected"
                : console.log("Selected Date:", value.format("DD-MM-YYYY"));
        }
    };

    // Function to handle download button click event
    const handleDownloadButtonClick = () => {
        setLoading(true);
        setCompleted(false);
        setError(false);
        // Check if date is selected
        if (date) {
            // Make API call to csvDownloader
            axios
                .post("/api/csvDownloader", { value: date })
                .then((response) => {
                    // Handle successful response
                    setLoading(false);
                    setCompleted(true);
                    setError(false);
                    console.log("CSV downloaded successfully:", response.data);
                    // You can further process the response as needed
                })
                .catch((error) => {
                    // Handle errors
                    setLoading(false);
                    setCompleted(false);
                    setError(true);
                    console.error("Error downloading CSV:", error);
                });
        } else {
            setLoading(false);
            setCompleted(false);
            setError(true);
            console.log("Please select a date before downloading.");
        }
    };

    return (
        <div className="dateSelector flex flex-col gap-3 mt-32">
            <div className="dateSelector_title">
                <p className="text-6xl font-semibold text-zinc-500">Select Date</p>
            </div>

            <div className="dateSelector_input flex items-center gap-1 w-full">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                        defaultValue={date}
                        label={"Select"}
                        className="w-full"
                        value={date}
                        onChange={handleDateChange}
                    />
                </LocalizationProvider>
            </div>

            <Button
                variant={loading ? "text" : "contained"}
                color={
                    loading && !completed && !error
                        ? "primary"
                        : !loading && completed && !error
                            ? "success"
                            : !loading && !completed && !error
                                ? "primary"
                                : !loading && error
                                    ? "error"
                                    : "primary"
                }
                size="large"
                startIcon={
                    loading && !completed && !error ? (
                        <CircularProgress />
                    ) : !loading && completed && !error ? (
                        <DoneIcon />
                    ) : !loading && !completed && !error ? (
                        <DownloadIcon />
                    ) : (
                        !loading && !completed && error && <ErrorIcon />
                    )
                }
                className="download_btn"
                disabled={!date || !dayjs.isDayjs(date)}
                onClick={handleDownloadButtonClick}
            >
                {!loading && !completed && !error && <span>Download</span>}
                {loading && <span></span>}
                {completed && <span>Complete</span>}
                {error && <span>Error</span>}
            </Button>
        </div>
    );
}
