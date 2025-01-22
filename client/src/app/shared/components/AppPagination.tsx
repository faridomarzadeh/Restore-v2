import { Box, Pagination, Typography } from "@mui/material";
import { Pagination as PaginationType } from "../../models/pagination";

type Props = {
    paginationData: PaginationType,
    onPageChange: (page:number) => void;
}
export default function AppPagination({paginationData, onPageChange}: Props) {

    const {currentPage, pageSize, totalCount, totalPages} = paginationData;

    const startItem = (currentPage - 1) * pageSize +1;
    const endItem = Math.min((currentPage * pageSize), totalCount);
  return (
    <Box display='flex' justifyContent='space-between' alignItems='center' mt={3}>

        <Typography>
            Displaying {startItem} - {endItem} of {totalCount} items.
        </Typography>
                <Pagination
                size="large"
                color="secondary"
                count={totalPages}
                page={currentPage}
                onChange={(_,page) => onPageChange(page)}
                />
    </Box>
  )
}
