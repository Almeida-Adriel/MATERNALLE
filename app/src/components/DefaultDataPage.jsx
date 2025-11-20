// DefaultDataPage.jsx
import React from 'react';
import ToolSearch from './ToolSearch';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const DefaultDataPage = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  dataList = [],
  onSearch = () => {},
  query = '',
  order = 'newest',
  onOrderChange = () => {},
  labelButton,
  onOpenCreate = () => {},
  columns = [],
  renderRow,
  emptyMessage = 'Nenhum registro encontrado',
  loading = false,
}) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <>
      <ToolSearch
        search={query}
        onSearch={onSearch}
        order={order}
        onOrderChange={onOrderChange}
        labelButton={labelButton}
        onOpenCreate={onOpenCreate}
      />

      <Box mt={2}>
        <TableContainer component={Paper} elevation={3}>
          <Table aria-label="data table">
            <TableHead>
              <TableRow>
                {columns.length > 0 ? (
                  columns.map((col) => (
                    <TableCell
                      key={col.key}
                      sx={{
                        fontWeight: 600,
                        ...(col.align && { textAlign: col.align }),
                        ...(col.width && { width: col.width }),
                      }}
                    >
                      {col.header}
                    </TableCell>
                  ))
                ) : (
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Dados
                    </Typography>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={Math.max(columns.length, 1)}>
                    <Box
                      py={4}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      gap={2}
                    >
                      <CircularProgress size={24} />
                      <Typography variant="body2" color="text.secondary">
                        Carregando conteúdos...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {!loading && dataList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={Math.max(columns.length, 1)}>
                    <Typography
                      variant="body2"
                      align="center"
                      sx={{ py: 2, color: 'text.secondary' }}
                    >
                      {emptyMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                dataList.length > 0 &&
                dataList.map((item) => {
                  if (typeof renderRow === 'function') {
                    return renderRow(item);
                  }

                  return (
                    <TableRow
                      key={item.id}
                      hover
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: 'rgba(0,0,0,0.01)',
                        },
                      }}
                    >
                      {columns.map((col) => (
                        <TableCell
                          key={col.key}
                          sx={{
                            ...(col.align && { textAlign: col.align }),
                            ...(col.width && { width: col.width }),
                          }}
                        >
                          {col.render ? col.render(item) : item[col.key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box
        mt={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Button
          variant="contained"
          color="primary"
          disabled={currentPage === 1}
          onClick={handlePrev}
        >
          Anterior
        </Button>

        <Typography variant="body2">
          Página {currentPage} de {totalPages}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          disabled={currentPage === totalPages}
          onClick={handleNext}
        >
          Próxima
        </Button>
      </Box>
    </>
  );
};

export default DefaultDataPage;
