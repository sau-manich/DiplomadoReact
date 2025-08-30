import { Box } from '@mui/material';
import {
  TaskDialog,
  TaskFilter,
  TaskHeader,
  TaskTabla,
  type TaskActionState,
} from '../../components';
import { useEffect, useState } from 'react';
import type { TaskFilterDoneType, TaskType } from '../../components/tasks/type';
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { useAlert, useAxios } from '../../hooks';
import { errorHelper, hanleZodError } from '../../helpers';
import { schemaTask, type TaskFormValues } from '../../models';

export const TasksPage = () => {
  const { showAlert } = useAlert();
  const axios = useAxios();

  const [filterStatus, setFilterStatus] = useState<TaskFilterDoneType>('all');
  const [search, setSearch] = useState('');
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [total, setTotal] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 1,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [task, setTask] = useState<TaskType | null>(null);

  useEffect(() => {
    listTaskApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterStatus, paginationModel, sortModel]);

  const listTaskApi = async () => {
    try {
      const orderBy = sortModel[0]?.field;
      const orderDir = sortModel[0]?.sort;
      const response = await axios.get('/tasks', {
        params: {
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
          orderBy,
          orderDir,
          search,
          done: filterStatus === 'all' ? undefined : filterStatus,
        },
      });
      setTasks(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      showAlert(errorHelper(error), 'error');
    }
  };

  const handleOpenCreateDialog = () => {
    setOpenDialog(true);
    setTask(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTask(null);
  };

  const handleOpenEditDialog = (task: TaskType) => {
    setOpenDialog(true);
    setTask(task);
  };

  const handleCreateEdit = async (
    _: TaskActionState | undefined,
    formdata: FormData
  ) => {
    const rawData = {
      name: formdata.get('name') as string,
    };

    try {
      schemaTask.parse(rawData);
      if (task?.id) {
        await axios.put(`/tasks/${task.id}`, rawData);
        showAlert('Tarea editada', 'success');
      } else {
        await axios.post('/tasks', rawData);
        showAlert('Tarea creada', 'success');
      }
      listTaskApi();
      handleCloseDialog();
      return;
    } catch (error) {
      const err = hanleZodError<TaskFormValues>(error, rawData);
      showAlert(err.message, 'error');
      return err;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const confirmed = window.confirm('¿Estas seguro de eliminar?');
      if (!confirmed) return;

      await axios.delete(`/tasks/${id}`);
      showAlert('Tarea eliminada', 'success');
      listTaskApi();
    } catch (error) {
      showAlert(errorHelper(error), 'error');
    }
  };

  const handleDone = async (id: number, done: boolean) => {
    try {
      const confirmed = window.confirm(
        '¿Estas seguro de que quieres cambiar el estado?'
      );
      if (!confirmed) return;

      await axios.patch(`/tasks/${id}`, { done: !done });
      showAlert('Tarea modificada', 'success');
      listTaskApi();
    } catch (error) {
      showAlert(errorHelper(error), 'error');
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header con titulo y boton agregar */}
      <TaskHeader handleOpenCreateDialog={handleOpenCreateDialog} />

      {/* Barra de herramientas con filtros y busquedas */}
      <TaskFilter
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        setSearch={setSearch}
      ></TaskFilter>

      {/* Tabla */}
      <TaskTabla
        tasks={tasks}
        rowCount={total}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        sortModel={sortModel}
        setSortModel={setSortModel}
        handleDelete={handleDelete}
        handleDone={handleDone}
        handleOpenEditDialog={handleOpenEditDialog}
      />

      {/* Dialog */}
      <TaskDialog
        open={openDialog}
        task={task}
        onClose={handleCloseDialog}
        handleCreateEdit={handleCreateEdit}
      />
    </Box>
  );
};
